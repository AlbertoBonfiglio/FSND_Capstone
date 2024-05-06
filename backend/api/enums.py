from enum import Enum

class Status(Enum):
  active = 'active',
  inactive = 'inactive',
  deleted = 'deleted'

  def __repr__(self):
    return self.value
