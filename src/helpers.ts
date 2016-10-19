export const jsxInstanceOf = cls => {
    return (props, propName, componentName) => {
        if (props[propName].type !== cls.default) {
            return new Error(
                'Invalid prop `' + propName + '` supplied to' +
                ' `' + componentName + '`. Validation failed.'
            );
        }
    }
};

export function deepMap(arr, f, ctx = null) {
    return arr.map((val, key) => {
        let obj = f.call(ctx, val, key);
        if (Array.isArray(obj.childs)) {
            obj.childs = deepMap(obj.childs, f, ctx);
            return obj;
        } else {
            return obj;
        }
    })
}