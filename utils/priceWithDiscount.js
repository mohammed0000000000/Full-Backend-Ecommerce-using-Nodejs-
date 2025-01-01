
const priceWithDiscount = (price, discount = 1) => {
    const discountAmout = Math.ceil((Number(price) * Number(discount)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}

export default  priceWithDiscount;