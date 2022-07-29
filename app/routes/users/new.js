import Route from '@ember/routing/route';

export default Route.extend({


    model() {

        return this.store.createRecord('user', {
            img_url: "",
            first_name: "",
            last_name: "",
            email: "",
            team: "",
            joiningDate: "",
            designation: ""
        });

    }

});
