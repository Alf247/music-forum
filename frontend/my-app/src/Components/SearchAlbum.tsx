import axios from "axios";
import { useState } from "react";
import './SearchAlbum.css'

interface Select {
    setSelect: React.Dispatch<React.SetStateAction<any>>
}

function SearchAlbum({ setSelect: setSelected }: Select) {

    const [input, setInput] = useState('')
    const [results, setResults] = useState([])

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimeout(() => {}, 30)
        const value = e.target.value
        setInput(value)

        if (input === '') {
            setResults([])
        } else {
            axios.get('/albums', { params: { album: value} }).then(res => {
                setResults(res.data.albums.items)
            }).catch(err => {
                console.error('Error getting /album: ' + err)
            })
        }

    }

    const handleSelect = (item: any) => {
        setInput(item['name'])
        setSelected(item)
        console.log(item)
        setResults([])
    }

    return ( 
        <div className="search-content">
            <div>
                <input 
                  type="text"
                  placeholder="Search for an album"
                  value={input}
                  onChange={handleChange} />

                <ul>
                {results.map(item => (
                    <li key={item['id']} onClick={() => handleSelect(item)}>
                        <b>{item['name']}</b> ({(item['release_date'] as string).slice(0,4) ?? 'N/A'}) by {item['artists'][0]['name']}
                    </li>
                ))}
                </ul>
            </div>
            <div></div>
        </div>
    );
}

export default SearchAlbum;