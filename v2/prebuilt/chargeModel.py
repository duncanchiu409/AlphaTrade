from ..lib.chargeModel import BaseChargeModel

class SimpleChargeModel(BaseChargeModel):
  def __init__(self, each_charge):
    self.each_charge = each_charge
    self.total_charge = 0

  def calculate_charge(self, row):
    self.total_charge += self.each_charge
    return self.each_charge