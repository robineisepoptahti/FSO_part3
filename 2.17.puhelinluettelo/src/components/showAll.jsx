import ShowEntry from './showEntry'

const ShowAll = ({ persons, newFilter, deleteEntry}) => {
    const notesToShow = newFilter === ''
        ? persons
        : persons.filter(note => note.name.toLowerCase().startsWith(newFilter.toLowerCase()))

    return (
        <div>
            {notesToShow.map(entry => (
                <div key={entry.name}>
                    <ShowEntry entry={entry} deleteEntry={deleteEntry}/>
                </div>
            ))}
        </div>
    )
}

export default ShowAll

