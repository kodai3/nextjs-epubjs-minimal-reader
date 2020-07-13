import React, { useEffect, useRef, useState } from 'react'
import { Rendition, Location } from 'epubjs'
import { Swipeable, EventData } from 'react-swipeable'
import { makeStyles } from '@material-ui/styles'
import Navigator from './Navigator'
import windowSize from 'react-window-size';

const useStyles = makeStyles(() => ({
    epubjs: {
        position: "relative",
        width: '100%',
        height: '100%'
    },
    reader: {
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
}))
interface ReaderProps {
    url: any
    fontSize?: string
    fontFamily?: string
    fontColor?: string
    className?: string

    cfi?: string

    onLoad?: (rendition?: Rendition) => void
    onNext?: (rendition?: Rendition) => void
    onPrev?: (rendition?: Rendition) => void
    onRelocated?: (location?: Location) => void

    renderChapters?: (tocs: any) => React.ReactNode

    width?: number;
    height?: number
}

export const Reader: React.FC<ReaderProps> = ({
    url,
    fontSize,
    fontFamily,
    fontColor,
    onLoad,
    onNext,
    onPrev,
    onRelocated,
    className = '',
    cfi,
    width,
    height
}) => {
    const classes = useStyles()
    const ref = useRef<HTMLDivElement>(null)
    const [rendition, setRendition] = useState<Rendition | null>(null)
    const [info, setInfo] = useState()
    const [percent, setPercent] = useState(0)

    console.log(info, percent)

    useEffect(() => {
        (async () => {
            const el = ref.current
            if (!el) return
            const ePub = await (await import('epubjs')).default
            const ebook = ePub(url)
            const rendition = ebook.renderTo(el, { flow: 'paginated', width, height })
            onReaderLoad(ebook, rendition)
        })()
    }, [])

    const onReaderLoad = (ebook: any, rendition: Rendition) => {
        if (!rendition) return
        setRendition(rendition)

        cfi ? rendition.display(cfi) : rendition.display()

        setupStyles(rendition)

        ebook.ready.then(async () => {
            const { package: { metadata = {} } = {} } = ebook
            setInfo(metadata)

            await ebook.locations.generate(1600)

            onLoad && onLoad(rendition)
            onRelocated && rendition.on('relocated', handleRelocated(ebook))
        })
    }

    const setupStyles = (rendition: any) => {
        fontSize && rendition.themes.default({ p: { 'font-size': `${fontSize} !important` } })
        fontColor && rendition.themes.default({ p: { color: `${fontColor} !important` } })
        fontFamily && rendition.themes.default({ p: { fontFamily: `${fontFamily} !important` } })
    }

    const handleRelocated = (ebook: any) => (location: Location): void => {
        if (onRelocated) onRelocated(location)

        const percent = ebook.locations.percentageFromCfi(location.start.cfi)
        setPercent(percent)
    }

    const handleNext = () => {
        if (!rendition) return
        rendition.next()
        onNext && onNext(rendition)
    }

    const handlePrev = () => {
        if (!rendition) return
        rendition.prev()
        onPrev && onPrev(rendition)
    }

    const handleSwipe = (eventData: EventData) => {
        console.log(eventData, 'swpie event')
        const { dir } = eventData
        if (dir === 'Left') handleNext()
        if (dir === 'Right') handlePrev()
    }

    return (
        <Swipeable onSwiped={handleSwipe} className={classes.epubjs} trackTouch trackMouse>
            <Navigator handleNext={handleNext} handlePrev={handlePrev} />
            <div className={`${classes.reader} ${className}`} ref={ref} />
        </Swipeable>
    )
}

export default windowSize(Reader)