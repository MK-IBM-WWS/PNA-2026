function maxQualityDifference(nums) {
    const n = nums.length;
    if (n < 4) return null;

    const products = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            products.push({
                value: nums[i] * nums[j],
                indices: [i, j]
            });
        }
    }
    products.sort((a, b) => a.value - b.value);
    
    let maxDiff = -Infinity;
    for (let i = 0; i < products.length; i++) {
        for (let j = products.length - 1; j > i; j--) {
            if (products[i].indices[0] !== products[j].indices[0] &&
                products[i].indices[0] !== products[j].indices[1] &&
                products[i].indices[1] !== products[j].indices[0] &&
                products[i].indices[1] !== products[j].indices[1]) {
                
                const diff = products[j].value - products[i].value;
                maxDiff = Math.max(maxDiff, diff);
                break;
            }
        }
    }
    return maxDiff;
}

const nums1 = [5, 6, 2, 7, 4];
console.log(maxQualityDifference(nums1)); // 34
const nums = [-4, -6,8,9,2,-1];
console.log(maxQualityDifference(nums)); // 84

console.log(maxQualityDifference([1, 2, 3, 4])); // 10
console.log(maxQualityDifference([-5, -4, -3, -2])); // 14
console.log(maxQualityDifference([-10, 1, 2, 3])); // 16


