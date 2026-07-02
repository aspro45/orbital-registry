from pathlib import Path
from gltest_cli.config.general import get_general_config
from gltest_cli.config.user import load_user_config
from gltest import get_contract_factory, get_default_account, get_gl_client
ROOT = Path(__file__).resolve().parents[1]; GEN = 10 ** 18
cfg = load_user_config(str(ROOT / "gltest.config.yaml")); get_general_config().user_config = cfg
acct = get_default_account()
try:
    get_gl_client().fund_account(acct.address, 50 * GEN); print("funded", acct.address)
except Exception as e:
    print("fund:", e)
factory = get_contract_factory(contract_file_path=str(ROOT / "contracts" / "orbitalregistry.py"))
print("ADDR=" + str(factory.deploy(args=[]).address), flush=True)
