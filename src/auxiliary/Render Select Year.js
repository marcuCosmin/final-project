import React from 'react'

export default function SelectYear() {

    const years = [];

    const minimumYear = new Date().getFullYear() - 105;

    for (let year = new Date().getFullYear(); year - minimumYear !== -1; year--) {

        years.push(year);
    }

    return (

        <>

            {years.map((year) => <option value={year} key={year}>{year}</option>)}

        </>

    )
}
