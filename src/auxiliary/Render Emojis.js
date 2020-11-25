import React from 'react'

export default function Emojis() {

    const emojiRange = [[128513, 128591], [9986, 10160], [128640, 128704]];

    const emojis = [];

    for (const array of emojiRange) {

        for (let number = array[0]; number < array[array.length - 1]; number++) {

            emojis.push((`&#${number};`));

        }
    }

    console.log(Symbol(emojis[0]));

    console.log(emojis);

    return (

        <>

            {emojis.map((emoji) => <input type="button" value={Symbol(emoji)} key={emoji}/>)}

        </>
    )
}
