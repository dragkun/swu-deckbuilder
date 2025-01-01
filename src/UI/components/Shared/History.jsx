import React, { useEffect } from 'react'
import { useState } from 'react'
import { DateTime } from 'luxon'

import '../../styles/History.scss'

const History = ({ deck }) => {
    const [history, setHistory] = useState([])

    useEffect(() => {
        window.db.getDeckHistory(deck).then((history) => {
            const validHistory = history.filter(h => h.changes.length > 0)
            setHistory(validHistory)
        })
    }, [deck])

    return (
        <div>
            {history.map((h) => (
                <div key={h.version} className="history">
                    <div className="history-header">
                        <div className="history-date">{DateTime.fromMillis(h.modified || 0).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}</div>
                        {h.changes?.length > 1 && <div className="history-changes">{h?.changes?.length} Change(s)</div>}    
                    </div>
                    <div>{h?.changes?.map((c) => (
                        <div key={c.uid} className="history-change">
                            {c?.added ? <span className="added">{`+${c?.added}`}</span> : <span className="removed">{`-${c?.removed}`}</span>} <span className={c?.added ? 'added' : 'removed'}>{c?.title}</span>
                        </div>
                    ))}</div>   
                </div>
            ))}
        </div>
    )
}

export default History