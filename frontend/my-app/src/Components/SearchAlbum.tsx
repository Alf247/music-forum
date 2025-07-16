import axios from "axios";
import { useEffect, useState } from "react";

function SearchAlbum() {

    const [input, setInput] = useState('')
    const [results, setResults] = useState([])
    const [selected, setSelected] = useState('')

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimeout(() => {}, 30)
        const value = e.target.value
        setInput(value)

        axios.get('/albums', { params: { album: input} }).then(res => {
            setResults(res.data.albums.items)
        }).catch(err => {
            console.error('Error getting /album: ' + err)
        })
    }

    const handleSelect = (item: string) => {
        setInput(item)
        setSelected(item)
        setResults([])
    }

    const handleSubmit = async () => {}

    return ( 
        <>
            <input 
            type="text"
            placeholder={input}
            onChange={handleChange} />
            <ul>
                {results.map(item => (
                    <li key={item['id']} onClick={() => handleSelect(item['name'])}>
                        <b>{item['name']}</b> ({(item['release_date'] as string).slice(0,4) ?? 'N/A'}) by {item['artists'][0]['name']}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default SearchAlbum;