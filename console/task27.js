function sumDiagonals(matrix) {
    if (!matrix || matrix.length === 0) return 0;
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
        if (!matrix[i] || matrix[i].length !== n) {
            throw new Error("Матрица должна быть квадратной");
        }
    }
    
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += matrix[i][i];
        sum += matrix[i][n - 1 - i];
    }
    if (n % 2 === 1) {
        const center = Math.floor(n / 2);
        sum -= matrix[center][center];
    }
    return sum;
}

console.log(sumDiagonals([[1, 2, 3], [4, 5, 6], [7, 8, 9]])); // 25