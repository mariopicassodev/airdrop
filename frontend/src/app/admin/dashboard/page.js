
export default function AdminDashboardPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-9 text-center">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-9">
                <div className="flex items-center justify-center">
                    <div className="card bg-neutral text-neutral-content w-96">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">Paused!</h2>
                            <p>Resume the airdrop</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary">Resume</button>
                                <button className="btn btn-ghost">Pause</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="stats shadow md:col-span-2">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div className="stat-title">Total MTK</div>
                        <div className="stat-value text-primary">25.6K</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <div className="stat-title">Claimed MTK</div>
                        <div className="stat-value text-secondary">2.6M</div>
                    </div>

                    <div className="stat">
                        <div className="stat-value">86%</div>
                        <div className="stat-title">Claimed</div>
                        <div className="stat-desc text-secondary">987 MTK remaining</div>
                    </div>
                </div>

            </div>



            <div className="overflow-x-auto mt-5">
                <h1 className="text-center font-bold">Last Claims</h1>
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>Address</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        <tr className="hover">

                            <td>0xjkhasdkjhaskfjhsdkfjhsdkjfh</td>
                            <td>500</td>

                        </tr>
                        {/* row 2 */}
                        <tr className="hover">

                            <td>0xakjsdhkajshdkjashdkjashddsgf</td>
                            <td>546</td>

                        </tr >
                        {/* row 3 */}
                        <tr className="hover">

                            <td>0xalskjdlsajdoeijhflnasdfgfhdfg</td>
                            <td>564</td>

                        </tr>
                    </tbody>
                </table>
            </div>

        </div>

    )
}
