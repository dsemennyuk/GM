const { LinkedList } = require("./LinkedList");
const { findNodeById } = require("./helpers");

class Person {
  constructor({ id, name, gender, integral = true, motherId, fatherId }) {
    this.id = id;
    this.name = name;
    this.gender = gender;
    this.kids = new LinkedList();
    this.marriage = null;
    this.integral = integral;
    this.motherId = motherId;
    this.fatherId = fatherId;
  }

  marry(partner) {
    this.marriage = {
      isMarried: true,
      partnerId: partner.id,
    };
    partner.marriage = {
      isMarried: true,
      partnerId: this.id,
    };
  }

  divorce(partner) {
    this.marriage = null;
    partner.marriage = null;
  }

  getData() {
    return {
      id: this.id,
      name: this.name,
      gender: this.gender,
      married: this.married,
      partnerId: this.partnerId,
    };
  }
}

class Main {
  constructor() {
    this.familyMembers = new LinkedList();
  }

  createRoot(mother, father) {
    mother.marry(father);

    this.familyMembers.append(mother);
    this.familyMembers.append(father);
  }

  makeABaby(motherId, fatherId, kidId, kidName, kidGender) {
    const personParams = {
      id: kidId,
      name: kidName,
      gender: kidGender,
      motherId,
      fatherId,
    };
    const kid = new Person(personParams);
    const mother = findNodeById(this.familyMembers, motherId).value;
    const father = findNodeById(this.familyMembers, fatherId).value;

    mother.kids.append(kid);
    father.kids.append(kid);

    this.familyMembers.append(kid);
  }

  marry(id, otherId, otherName, otherGender) {
    const personParams = {
      id: otherId,
      name: otherName,
      gender: otherGender,
      integral: false,
    };
    const newPerson = new Person(personParams);
    const partner = findNodeById(this.familyMembers, id).value;
    if (partner.marriage) {
      console.log("No!");
      return;
    }

    partner.marry(newPerson);

    this.familyMembers.append(newPerson);
  }

  divorce(motherId, fatherId, custody) {
    const mother = findNodeById(this.familyMembers, motherId).value;
    const father = findNodeById(this.familyMembers, fatherId).value;
    const withMother = custody === "withMother";
    const stayingWithPerson = withMother ? mother : father;

    if (!stayingWithPerson.integral) {
      this.familyMembers.forEach((value) => {
        const kids = value.kids;

        if (withMother) {
          if (value.motherId === stayingWithPerson.id) {
            this.familyMembers.delete(value.id, (node) => node.id);
          }
        } else {
          if (value.fatherId === stayingWithPerson.id) {
            this.familyMembers.delete(value.id, (node) => node.id);
          }
        }

        kids.forEach((kid) => {
          if (withMother) {
            if (kid.motherId === stayingWithPerson.id) {
              kids.delete(kid.id, (value) => value.id);
            }
          } else {
            if (kid.fatherId === stayingWithPerson.id) {
              kids.delete(kid.id, (value) => value.id);
            }
          }
        });
      });
    }

    mother.divorce(father);
  }

  renderTree() {
    const _renderTree = (list) => {
      const root1 = findNodeById(list, 1).value;
      const root2 = findNodeById(list, 2).value;

      console.log(`${root1.name} ____________ ${root2.name}`);

      const printNodeRecursive = (list, _i) => {
        let i = 0;
        if (!list) return;

        if (list) {
          list.forEach((n) => {
            // using arrays for output UI only
            let spacing = [];
            for (let g = 0; g < _i; g++) {
              spacing.push("    ");
            }
            const isMarried = n.marriage;
            if (!isMarried) {
              console.log(...spacing, `${n.name} id:${n.id} ___ NOT MARRIED`);
            } else {
              const kidPartner = findNodeById(
                this.familyMembers,
                n.marriage.partnerId
              );
              console.log(
                ...spacing,
                `${n.name} id:${n.id} ___ ${kidPartner.value.name} id:${kidPartner.value.id}`
              );
            }

            if (n.kids) {
              i = _i + 1;
              printNodeRecursive(n.kids, i);
            }
          });
          console.log("\n");
        }

        printNodeRecursive(list.next, i);
      };

      printNodeRecursive(root1.kids, 0);
    };

    _renderTree(this.familyMembers);
  }
}

const rootFatherParams = {
  id: 1,
  name: "Dima",
  gender: "Male",
};

const rootMotherParams = {
  id: 2,
  name: "Anna",
  gender: "Female",
};

const Dima = new Person(rootFatherParams);
const Anna = new Person(rootMotherParams);

const Family = new Main();

Family.createRoot(Anna, Dima);
console.log("============ CREATED ROOT TREE ==============");
Family.renderTree();

console.log("============ CREATED BABIES ROOT PARTNERS ==============");

Family.makeABaby(1, 2, 3, "Mark", "Male");
Family.makeABaby(1, 2, 100, "Drep", "Male");
Family.makeABaby(1, 2, 1000, "Crop", "Male");
Family.renderTree();

console.log(
  "============ MARRIAGE OF CHILDREN + CREATING BABIES (NESTED) =============="
);

Family.marry(3, 4, "Shany", "Female");
Family.makeABaby(4, 3, 5, "Roy", "Male");
Family.marry(5, 20, "Alice", "Female");
Family.makeABaby(20, 5, 25, "Baby", "Female");
Family.makeABaby(4, 3, 6, "Der", "Male");
Family.makeABaby(4, 3, 7, "Poe", "Male");

Family.renderTree();

console.log("============ DIVORCING ... BABIES deleted XDDD ==============");
Family.divorce(4, 3, "withMother");
Family.renderTree();

console.log("============ NEW OPPORTINUTY FOR MARK XDD ==============");

Family.marry(3, 7, "Zhanna", "Female");
Family.makeABaby(7, 3, 101, "Karen", "Female");
Family.makeABaby(7, 3, 1011, "Cder", "Female");
Family.makeABaby(7, 3, 1012, "Polska", "Male");

Family.renderTree();

console.log("============ MARK BROKE UP AGAIN, BUT NOW CHILDREN WITH HIM ==============");

Family.divorce(7,3,'withFather');
Family.renderTree();

console.log("============ BABIES OF BABIES MARRIAGE ==============");
Family.marry(1000, 322, "Carnx", "Female");

Family.renderTree();
