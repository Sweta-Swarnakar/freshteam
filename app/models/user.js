import DS from 'ember-data';
import { buildValidations, validator } from 'ember-cp-validations';



const Validations = buildValidations({
  first_name: [validator('presence', true),
  validator('length', {
    min: 2
  })
    ,
  validator('length', {
    max: 128
  })
  ],

  email: [
    validator('presence', true),
    validator('format', { type: 'email' })
  ],
  designation: [validator('presence', true),
  validator('length', {
    min: 2
  })
    ,
  validator('length', {
    max: 128
  })
  ],
  
  last_name: [validator('presence', true),
  validator('length', {
    min: 2
  })
    ,
  validator('length', {
    max: 128
  })
  ],
  


});

export default DS.Model.extend(
  Validations, {
  img_url: DS.attr('string'),
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  designation: DS.attr('string'),
  email: DS.attr('string'),
  team: DS.attr('string'),
  joiningDate: DS.attr('date')
});
