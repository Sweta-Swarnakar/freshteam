import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({

    first_name(i) {
    return `Person ${i}`;
  },

  last_name(i) {
    return `title ${i}`;
  },

  email(i){
   
    return `Person@${i,i+ 1}`;
  },

  team: 'Freshteam',
  
  joiningDate:  Date.now() + Math.random(),

  img_url() {
    return faker.internet.avatar();
  }

});