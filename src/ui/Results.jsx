// This component displays a list of blood banks with their details.
function Results({ loading, bloodBanks }) {
    return (
        <div className="w-3/4 overflow-y-auto p-6">
            {loading ? (
                // Display a loading message while data is being fetched
                <p className="text-lg text-gray-600">Loading blood banks...</p>
            ) : bloodBanks.length > 0 ? (
                <ul className="space-y-6">
                    {bloodBanks.map((bank) => (
                        <>
                            {/*Rendering each blood bank with its details*/}
                            <li
                                key={bank._id} // Unique key for each list item
                                className="rounded-lg border border-gray-200 bg-white p-5 shadow-md transition-shadow hover:shadow-lg"
                            >
                                <div className="pointer-events-none">
                                    <h2 className="text-xl font-bold text-red-700">
                                        {bank.name}
                                    </h2>

                                    <p className="text-gray-700">
                                        {bank.address}
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        Contact: {bank.contactNumber}
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        Price per unit: ₹{bank.pricePerUnit}
                                    </p>
                                </div>

                                {/* Link to Google Maps for navigation */}
                                <a
                                    href={`https://www.google.com/maps?q=${bank.location.coordinates[1]},${bank.location.coordinates[0]}`}
                                    target="_blank" // Open in a new tab
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                                >
                                    Navigate with Google Maps
                                </a>
                            </li>
                        </>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-600">No blood banks found.</p> // Message when no blood banks are available
            )}
        </div>
    );
}

export default Results;
