// // @ts-ignore
// import book from '../public/test.epub'
import dynamic from 'next/dynamic'

const Reader = dynamic(() => import('../components/reader/Reader'), { ssr: false })

const IndexPage = () => {

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Reader url={'/economics_to_be_happier.epub'} />
    </div>
  )
}

export default IndexPage
