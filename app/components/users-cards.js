import Component from '@ember/component';
import { computed, set, get } from '@ember/object';

export default Component.extend({

    classNames: ["content"],
    selectedTeam: "All Employees",

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
            return this.model;
        }

        else {
            return this.model.filter((el) => {
                return el.team == team;
            })}
        }),

        isSelected: computed('selectedTeam', 'team', function()
        {
            let selectedTeam = get(this, 'selectedTeam');

            if(this.team == selectedTeam)
            {
                return true;
            }
        }),

    actions: {
        selectTeam(team) {
            set(this, 'selectedTeam', team);
        }
        // isSelected(team) {
        //     return team === get(this, 'selectedTeam');
        // }
    }





});
