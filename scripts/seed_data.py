from pathlib import Path
from gltest_cli.config.general import get_general_config
from gltest_cli.config.user import load_user_config
from gltest import get_contract_factory, get_default_account
ROOT = Path(__file__).resolve().parents[1]
ADDR = "0xA56af147E27B799F013d2Fc8191aef793F255D51"
W = "https://en.wikipedia.org/api/rest_v1/page/summary/"
cfg = load_user_config(str(ROOT / "gltest.config.yaml")); get_general_config().user_config = cfg
factory = get_contract_factory(contract_file_path=str(ROOT / "contracts" / "orbitalregistry.py"))
c = factory.build_contract(ADDR, account=get_default_account())
O = [
    ("The International Space Station orbits Earth in low Earth orbit.", W + "International_Space_Station", True),
    ("The Hubble Space Telescope was launched in 1990.", W + "Hubble_Space_Telescope", True),
    ("Voyager 1 is the most distant human-made object from Earth.", W + "Voyager_1", True),
    ("A crewed station will be placed in orbit around Jupiter next year.", W + "Europa_Clipper", False),
]
def main():
    if c.get_object_count().call() == 0:
        for (d, u, _) in O:
            c.register_object(args=[d, u]).transact(); print("registered:", d[:42])
    for i in range(c.get_object_count().call()):
        do = O[i][2] if i < len(O) else False
        ob = c.get_object(args=[i]).call()
        if do and int(ob["status"]) == 0:
            print("verifying (AI):", ob["designation"][:36])
            try: c.verify_object(args=[i]).transact()
            except Exception as e: print("  ->", e)
    print("stats:", c.get_stats().call())
    for i in range(c.get_object_count().call()):
        ob = c.get_object(args=[i]).call()
        print(i, ["PENDING", "SETTLED", "REJECTED", "HOLDING"][int(ob["status"])], "|", ob["designation"][:40])
if __name__ == "__main__":
    main()
