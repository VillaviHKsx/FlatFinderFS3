function Table() {
    return (
        <div>
            <table id="flats-table" style={{border: "2px solid black"}}>
                <thead>
                <tr>
                    <th>City</th>
                    <th>Street Name</th>
                    <th>Street Number</th>
                    <th>Has AC</th>
                    <th>Area Size</th>
                    <th>Price</th>
                    <th>Date Available</th>
                    <th>Year Built</th>
                    <th>Action</th>
                </tr>
                </thead> 
                <tbody>
                <tr>    
                    <td colspan="9"> No existen Favoritos</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}       

export default Table