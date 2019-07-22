export function getIn(obj, keyArray = []) {
    if (obj && typeof obj.getIn === 'function') {
        return obj.getIn(keyArray);
    }

    var current = obj;

    for (var i = 0; i < keyArray.length; i++) {
        if (current[keyArray[i]] === undefined) {
            return undefined;
        } else {
            current = current[keyArray[i]];
        }
    }

    return current;
}