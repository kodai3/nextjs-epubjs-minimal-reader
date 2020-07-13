import React from 'react'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(() => ({
    'navigator': {
        zIndex: 2,
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    next: {
        width: '40%',
        height: '100%',
        float: 'right'
    },
    prev: {
        width: '40%',
        height: '100%',
        float: 'left'
    }
}))

interface NavigatorProps {
    handleNext?: () => void
    handlePrev?: () => void
}

export const Navigator: React.FC<NavigatorProps> = ({
    handleNext,
    handlePrev,
}) => {
    const classes = useStyles()
    return (
        <div className={classes.navigator}>
            <div className={classes.prev} onClick={handlePrev}></div>
            <div className={classes.next} onClick={handleNext}></div>
        </div>
    )
}

export default Navigator
