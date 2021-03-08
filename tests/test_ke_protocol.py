# pylint: skip-file

import digitaldash.test as KETester
from static.constants import KE_CP_OP_CODES

def test_constants_types():
    for value in KE_CP_OP_CODES.values():
      assert type(value) == type(1), "Confirm OP codes are integers."
