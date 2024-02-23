function bisectionSolver(fun, x0, x1, max_iter=10) {
    let f0, f1, f2, x2;
    f0 = fun(x0);
    f1 = fun(x1);
    if (f0 == 0) {return x0;}
    else if (f1 == 0) {return x1;}
    else if (f0*f1 > 0) {return x0;}
    for (let i=0; i<max_iter; i++) {
        x2 = (x0+x1)/2;
        f2 = fun(x2);
        if (f2 == 0) {return x2;}
        else if (f0*f2 < 0) { x1 = x2; f1 = f2;}
        else { x0 = x2; f0 = f2;}
    }
    return x2;
}

export {bisectionSolver};