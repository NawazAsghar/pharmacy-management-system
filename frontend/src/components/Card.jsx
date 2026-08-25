
function Card({product}) {
    return (
        <div>
            <img src="" alt="drug_img" />
            <h6>{product.name}</h6>
            <p>{product.scientific_name}</p>
            <p>stringth: 500 mg</p>
            <p>price RS: 450</p>
        </div>
    )
}

export default Card
