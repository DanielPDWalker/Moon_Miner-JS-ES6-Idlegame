import { Ore_Controller } from "./ore.js";
import { Refinery_Controller } from "./refinery.js";
import { Credit_Controller } from "./credit.js";
import { Market_Controller } from "./market.js";
import { Blueprint_Controller } from "./blueprint.js";
import { Industry_Controller } from "./industry.js";

var OC = new Ore_Controller();
var RC = new Refinery_Controller();
var CC = new Credit_Controller();
var MC = new Market_Controller();
var BP = new Blueprint_Controller();
var IC = new Industry_Controller(BP);

OC.updateMiningYieldUpgradeCost();

function readableNumber(inputInt) {
  return inputInt.toLocaleString(undefined);
}

function refine() {
  RC.ore_to_refine = OC.ore_min.innerText;

  if (RC.ore_to_refine == 0) {
    return;
  } else {
    OC.resetOreAmounts();
    RC.refineMaterial();
  }
}

setInterval(() => {
  if (OC.currently_mining === true) {
    if (OC.bar.style.width == "100%") {
      OC.resetBar();
      OC.miningCycle();
    } else {
      OC.bar.style.width = OC.percent + "%";
      OC.percent += 5;
    }
  }
  OC.checkStorage();
}, 500);

document.getElementById("refine_button").addEventListener("click", () => {
  refine();
});

document
  .getElementById("upgrade_storage_button")
  .addEventListener("click", () => {
    if (RC.material_count["Iron"] >= OC.upgrade_cost_storage) {
      RC.material_count["Iron"] =
        RC.material_count["Iron"] - OC.upgrade_cost_storage;
      OC.upgradeStorage();
      RC.updateMaterialCount();
    }
  });

document
  .getElementById("upgrade_mining_yeild_button")
  .addEventListener("click", () => {
    OC.upgradeMining(RC);
  });

document.getElementById("sell_100_button").addEventListener("click", () => {
  if (OC.total_ore >= 100) {
    MC.sellOre(CC, OC);
    MC.updateOreCost();
  }
});

document
  .getElementById("mining_drone_blueprint_buy_button")
  .addEventListener("click", () => {
    MC.buyBlueprint(CC, BP, IC, "mining_drone");
  });
