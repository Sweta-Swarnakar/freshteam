import Component from '@ember/component';
import { computed, set, get } from '@ember/object';

export default Component.extend({

    classNames: ["content"],
    selectedTeam: "All Employees",

    selectedOrder: "Ascending",

    selectedType: "first_name",



    type: computed(function () {
        return [{
            displayName: 'First Name',
            value: 'first_name'
        },
        {
            displayName: 'Last Name',
            value: 'last_name'
        }];
    }),

    order: computed(function () {
        return ['Ascending', 'Descending'];
    }),


    teams: computed('model', function () {
        let temp = ["All Employees"];

        let users = this.model;
        users.map(function (user) {
            if (!temp.includes(user.team)) {
                temp.push(user.team)
            }
        })


        return temp;
    }),

    filteredUsers: computed('selectedTeam', function () {

        let team = get(this, 'selectedTeam');
        if (team === "All Employees") {
            return this.model.filter(el => el);
        }

        else {
            return this.model.filter((el) => {
                return el.team == team;
            })
        }
    }),


    sortedArray: computed('filteredUsers.[]', 'selectedType', 'selectedOrder', function () {
        
        let filterUsers = get(this, 'filteredUsers');

        var selectedType = get(this, 'selectedType');

        let selectedOrder = get(this, 'selectedOrder');

        if(selectedOrder == "Ascending" || "")
        {
           filterUsers.sort((user1, user2) =>
           {
            return user1[selectedType] > user2[selectedType] ? 1 : -1;
           })


        }

        else  if(selectedOrder == "Descending")
        {
           filterUsers.sort((user1, user2) =>
           {
            return user1[selectedType] < user2[selectedType] ? 1 : -1;
           })


        }

       
        
       return filterUsers;
    }),
   
    actions: {
        selectTeam(team) {
            set(this, 'selectedTeam', team);
        },
       selectType(type)
       {
        set(this, 'selectedType', type);
       },

       selectOrder(order)
       {
        set(this, 'selectedOrder', order);
       }

    }





});


