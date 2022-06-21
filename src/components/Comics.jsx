import { Card } from '@mui/material'
import React from 'react'


const Comics = ({ data, message }) => {
   
    const res = data.map(item =>
        <Card
            className="mt-2 ms-2 me-2 d-flex"
            key={item.id}>
            <div><img src={item.thumbnail} alt={item.title} /></div>
            <div>
                <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                <div>{item.description}</div>
            </div>
        </Card>)
    const result = !message ? <div className="mt-5" >{res}</div> : <div className="text-center"><h2>{message}</h2></div>;

    return (
        <>{result}</>
    )
}

export default Comics
