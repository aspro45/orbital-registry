# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
"""
ORBITALREGISTRY - Objects that Settle into Stable Orbits on Confirmation
=======================================================================
Each registry object is a designation (a factual statement about a real entity)
paired with a public source. Verifying it makes the contract read the source; a
validator set (Equivalence Principle) decides whether the source CONFIRMS it.

Status: PENDING(0, holding orbit) -> SETTLED(1, stable orbit) | REJECTED(2, draft path) | HOLDING(3, undetermined)
"""
from genlayer import *
from dataclasses import dataclass
import json
import typing

PENDING = 0
SETTLED = 1
REJECTED = 2
HOLDING = 3
MAX_DESIG = 240


@allow_storage
@dataclass
class RegObject:
    registrar: Address
    designation: str
    source_url: str
    status: u8
    assessment: str
    archived: u8


class OrbitalRegistry(gl.Contract):
    owner: Address
    objects: DynArray[RegObject]

    def __init__(self) -> None:
        self.owner = gl.message.sender_address

    @gl.public.write
    def register_object(self, designation: str, source_url: str) -> int:
        d = designation.strip()
        u = source_url.strip()
        if len(d) == 0:
            raise gl.vm.UserError("a designation is required")
        if len(d) > MAX_DESIG:
            raise gl.vm.UserError("designation exceeds 240 characters")
        if len(u) == 0:
            raise gl.vm.UserError("a source URL is required")
        if not (u.startswith("http://") or u.startswith("https://")):
            raise gl.vm.UserError("source URL must be http(s)")
        o = self.objects.append_new_get()
        o.registrar = gl.message.sender_address
        o.designation = d
        o.source_url = u
        o.status = u8(PENDING)
        o.assessment = ""
        o.archived = u8(0)
        return len(self.objects) - 1

    @gl.public.write
    def verify_object(self, object_id: int) -> None:
        o = self._get(object_id)
        if o.status != PENDING:
            raise gl.vm.UserError("this object is already verified")
        if o.archived != 0:
            raise gl.vm.UserError("this object is archived")
        designation = o.designation
        url = o.source_url

        def leader_fn() -> str:
            page = ""
            try:
                page = gl.nondet.web.get(url).body.decode("utf-8")[:6000]
            except Exception:
                page = ""
            if len(page.strip()) == 0:
                return json.dumps({"verdict": "undetermined", "assessment": "The source could not be read."})
            prompt = (
                f"Decide strictly from a source whether it CONFIRMS a designation.\n"
                f"Designation: {designation}\n\nSource:\n{page}\n\n"
                "Reply with ONLY JSON: {\"verdict\": \"confirmed\"|\"refuted\"|\"undetermined\", "
                "\"assessment\": \"one sentence grounded in the source\"}."
            )
            return gl.nondet.exec_prompt(prompt)

        def validator_fn(leader_res) -> bool:
            if not isinstance(leader_res, gl.vm.Return):
                return False
            return self._verdict_of(leader_res.calldata)[0] == self._verdict_of(leader_fn())[0]

        result = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
        verdict, assessment = self._verdict_of(result)
        o.assessment = assessment[:300]
        if verdict == "confirmed":
            o.status = u8(SETTLED)
        elif verdict == "refuted":
            o.status = u8(REJECTED)
        else:
            o.status = u8(HOLDING)

    @gl.public.write
    def archive_object(self, object_id: int) -> None:
        if gl.message.sender_address != self.owner:
            raise gl.vm.UserError("only the owner can archive")
        self._get(object_id).archived = u8(1)

    @gl.public.view
    def get_owner(self) -> str:
        return self.owner.as_hex

    @gl.public.view
    def get_object_count(self) -> int:
        return len(self.objects)

    @gl.public.view
    def get_stats(self) -> dict:
        s = 0
        r = 0
        h = 0
        p = 0
        for o in self.objects:
            if o.archived != 0:
                continue
            if o.status == SETTLED:
                s += 1
            elif o.status == REJECTED:
                r += 1
            elif o.status == HOLDING:
                h += 1
            else:
                p += 1
        return {"total": s + r + h + p, "settled": s, "rejected": r, "holding": h, "pending": p}

    @gl.public.view
    def get_object(self, object_id: int) -> dict:
        o = self._get(object_id)
        return {
            "registrar": o.registrar.as_hex,
            "designation": o.designation,
            "source_url": o.source_url,
            "status": int(o.status),
            "assessment": o.assessment,
            "archived": int(o.archived),
        }

    def _get(self, object_id: int) -> RegObject:
        if object_id < 0 or object_id >= len(self.objects):
            raise gl.vm.UserError("no such object")
        return self.objects[object_id]

    def _verdict_of(self, result: typing.Any) -> tuple:
        data = result
        if isinstance(data, str):
            data = self._extract_json(data)
        if not isinstance(data, dict):
            return ("undetermined", "")
        v = str(data.get("verdict", "undetermined")).strip().lower()
        assessment = str(data.get("assessment", ""))
        if v not in ("confirmed", "refuted", "undetermined"):
            v = "undetermined"
        return (v, assessment)

    def _extract_json(self, text: str) -> typing.Any:
        try:
            return json.loads(text)
        except (ValueError, TypeError):
            pass
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(text[start:end + 1])
            except (ValueError, TypeError):
                return None
        return None
