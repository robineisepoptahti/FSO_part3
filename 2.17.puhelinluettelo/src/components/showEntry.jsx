const ShowEntry = ({ entry, deleteEntry }) => {
    return (
        <p>
            {entry.name} {entry.number} 
            <button onClick={() => {
                console.log(`Deleting entry with id: ${entry.id}`)
                deleteEntry(entry)
            }}>delete</button>
        </p>
    )
}

export default ShowEntry
