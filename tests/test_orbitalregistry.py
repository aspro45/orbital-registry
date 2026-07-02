"""Direct tests for ORBITALREGISTRY. AI verify checked live via seed."""
from pathlib import Path
CONTRACT = str(Path(__file__).resolve().parents[1] / "contracts" / "orbitalregistry.py")
PENDING = 0


def _r(g, vm, who, d="The ISS orbits Earth in low Earth orbit.", u="https://example.com"):
    vm.sender = who
    return g.register_object(d, u)


def test_register(deploy, direct_vm, direct_alice):
    g = deploy(CONTRACT)
    assert _r(g, direct_vm, direct_alice) == 0
    assert g.get_object(0)["status"] == PENDING


def test_requires_designation(deploy, direct_vm, direct_alice):
    g = deploy(CONTRACT)
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("a designation is required"):
        g.register_object("   ", "https://x.com")


def test_desig_max(deploy, direct_vm, direct_alice):
    g = deploy(CONTRACT)
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("designation exceeds 240"):
        g.register_object("x" * 241, "https://x.com")


def test_non_http(deploy, direct_vm, direct_alice):
    g = deploy(CONTRACT)
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("must be http"):
        g.register_object("d", "tel:123")


def test_owner_archive(deploy, direct_vm):
    g = deploy(CONTRACT)
    g.register_object("d", "https://x.com")
    g.archive_object(0)
    assert g.get_object(0)["archived"] == 1
    assert g.get_stats()["total"] == 0


def test_unauthorized_archive(deploy, direct_vm, direct_alice, direct_bob):
    g = deploy(CONTRACT)
    owner = g.get_owner()
    non = direct_bob if str(direct_alice).lower() == str(owner).lower() else direct_alice
    direct_vm.sender = non
    with direct_vm.expect_revert("only the owner can archive"):
        g.archive_object(0)


def test_stats(deploy, direct_vm, direct_alice):
    g = deploy(CONTRACT)
    _r(g, direct_vm, direct_alice, d="A")
    _r(g, direct_vm, direct_alice, d="B")
    assert g.get_object_count() == 2 and g.get_stats()["pending"] == 2
