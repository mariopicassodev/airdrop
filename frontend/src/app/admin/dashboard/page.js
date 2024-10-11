'use client';

import { useState, useContext } from "react"
import { AppContext } from "@/context/AppContext";
import useGetLastClaims from "@/hooks/useGetLastClaims"
import useStatsTotalClaimedAmount from "@/hooks/useStatsTotalClaimedAmount"
import useIsPaused from "@/hooks/useIsPaused"
import usePause from "@/hooks/usePause"
import useUnpause from "@/hooks/useUnpause"



export default function AdminDashboardPage() {
    const { account, connectWallet, disconnectWallet, error } = useContext(AppContext);
    const [pauseUpdated, setPauseUpdated] = useState(false);
    const [claimsUpdated, setClaimsUpdated] = useState(false);
    const isPaused = useIsPaused(pauseUpdated);
    const { pause, pausing, pauseError, pauseSuccess } = usePause();
    const { unpause, unpausing, unpauseError, unpauseSuccess } = useUnpause();
    const { totalClaimedAmount, totalClaimableAmount } = useStatsTotalClaimedAmount(claimsUpdated);
    const { lastClaims, fetchLastClaimsError } = useGetLastClaims(() => setClaimsUpdated(!claimsUpdated));

    const handlePause = async () => {
        await pause();
        setPauseUpdated(!pauseUpdated);
    };

    const handleUnpause = async () => {
        await unpause();
        setPauseUpdated(!pauseUpdated);
    };
    return (
        <div className="container mx-auto p-4">
            <div className="navbar bg-base-100">
                <div className="navbar-start">
                    <a className="btn btn-ghost text-xl">Admin Dashboard</a>
                </div>
                <div className="navbar-end">
                    {account ? (
                        <a className="btn btn-secondary" onClick={disconnectWallet}>Disconnect</a>
                    ) : (
                        <a className="btn btn-primary" onClick={connectWallet}>Connect</a>
                    )}
                </div>
            </div>
            {account ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-9">
                        <div className="flex items-center justify-center">
                            <div className="card bg-neutral text-neutral-content w-96">
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title">{isPaused ? "Paused!" : "Active!"}</h2>
                                    <p>{isPaused ? "Resume the airdrop" : "Pause the airdrop"}</p>
                                    <div className="card-actions justify-end">
                                        <button
                                            className={`btn ${isPaused ? "btn-accent" : "btn-primary"}`}
                                            onClick={isPaused ?  handleUnpause : handlePause}
                                            disabled={pausing || unpausing}
                                        >
                                            {isPaused ? "Resume" : "Pause"}
                                        </button>
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
                                <div className="stat-value text-primary">{totalClaimableAmount.toString()}</div>
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
                                <div className="stat-value text-secondary">{totalClaimedAmount}</div>
                            </div>

                            <div className="stat">
                                <div className="stat-value">{((Number(totalClaimedAmount) / Number(totalClaimableAmount)) * 100).toFixed(2)}%</div>
                                <div className="stat-title">Claimed</div>
                                <div className="stat-desc text-secondary">{Number(totalClaimableAmount) - Number(totalClaimedAmount)} MTK remaining</div>
                            </div>
                        </div>

                    </div>

                    {pauseError && (
                        <p className="text-red-500 text-center">{pauseError}</p>
                    )}
                    {unpauseError && (
                        <p className="text-red-500 text-center">{unpauseError}</p>
                    )}



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
                                {lastClaims.map((claim, index) => (
                                    <tr className="hover" key={index}>
                                        <td>{claim.account}</td>
                                        <td>{claim.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {fetchLastClaimsError && (
                        <p className="text-red-500 text-center">{fetchLastClaimsError}</p>
                    )}
                </>
            ) : (
                <p>Connect your wallet to get started</p>
            )}
            {error && <p className="text-red-500">{`Error: ${error}`}</p>}
        </div>

    )
}
