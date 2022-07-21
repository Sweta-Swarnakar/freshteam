import { helper } from '@ember/component/helper';

export function equalHelper(params) {
    let [arg1, arg2] = params;


    if (arg1 === arg2) {
        return true;
    }
    else {
        return false;
    }
}

export default helper(equalHelper);