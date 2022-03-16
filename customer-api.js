const {faker} = require('@faker-js/faker');
const fs = require('fs');

const generateContacts = () =>
{
    const contacts = [];
    for (let i=1; i<=10000; i++) {
        contacts.push({
          CustomerID : i,
          CustomerName : faker.name.firstName(),
          Age : faker.datatype.number({ min: 25, max: 60 }),
          Qualification : faker.random.objectElement(['MCA','B.TECH', 'M.TECH']),
          Income : faker.datatype.number({ min: 10000, max: 1000000 }),
          WorkExp : faker.datatype.number({ min: 1, max: 20 }),
          NumofHousehold : faker.datatype.number({ min: 1, max: 10000 }),
          Region : faker.address.city(),
          State : faker.address.state(),
          AccountBalance : faker.datatype.number({ min: 10000, max: 10000000 }),
          RelationShipTenure : faker.datatype.number({ min: 1,max: 15 }),
          NumberofAccounts : faker.datatype.number({ min: 1, max: 5 }),
          TypeofAccount : faker.random.objectElement(['Savings', 'Credit Card', 'Loan', 'OverDraft']),
          EmploymentStatus : faker.datatype.boolean()
        });
      }
      //return { "contacts": contacts }
      return  contacts
};

//Write the generated customer info to json file.
fs.writeFileSync(
    "./db.json",
    JSON.stringify({
        contacts:generateContacts()
    })
);

module.exports = generateContacts
/*const { faker } = require('@faker-js/faker');

const generateCustomer = (number) =>{
    const images = [];
    while (number !==0){
        const value = faker.image.image();
        images.push(value);
        number -- ;
    }
    return images;
};
console.log(generateCustomer(10));*/