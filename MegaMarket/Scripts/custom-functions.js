//Where
Array.prototype.Where = function (expression) {
    var items = [],
        length = this.length;

    for (var i = 0; i < length; i++) {
        if (eval('this[i].' + expression))
            items.push(this[i]);
    }

    return items.length == 0 ? null : items;
}


//Any
Array.prototype.Any = function (expression) {
    var length = this.length;

    for (var i = 0; i < length; i++) {
        if (eval('this[i].' + expression))
            return true;
    }

    return false;
}


//First
Array.prototype.First = function (expression) {
    var length = this.length,
        item = null;

    for (var i = 0; i < length; i++) {
        if (eval('this[i].' + expression)) {
            item = this[i];
            break;
        }
    }

    return item;
}


//Last
Array.prototype.Last = function (expression) {
    var length = this.length - 1,
        item = null;

    for (var i = length; i >= 0; i--) {
        if (eval('this[i].' + expression)) {
            item = this[i];
            break;
        }
    }

    return item;
}


//Select
Array.prototype.Select = function (field) {
    var length = this.length,
        items = [];

    for (var i = 0; i < length; i++) {
        items.push(eval('this[i].' + field));
    }

    return items;
}


//Max
Array.prototype.Max = function (field) {
    return field == undefined ? Math.max.apply(null, this) : Math.max.apply(null, this.Select(field));
};


//Min
Array.prototype.Min = function (field) {
    return field == undefined ? Math.min.apply(null, this) : Math.min.apply(null, this.Select(field));
};


//ForEach
Array.prototype.ForEach = function (_function) {
    var length = this.length;

    for (var i = 0; i < length; i++) {
        _function(this[i]);
    }

    return 'array length: ' + length;
}


//IsUndefinedNullOrEmpty
function IsUndefinedNullOrEmpty(item) {
    return item == undefined || item == null || item == '';
}