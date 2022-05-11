import Link from 'next/link'


const LabelComponent = ({tags}) => {

    return (

        tags.map(tag => {

            return (

                <Link href={{
                    pathname: '/browse',
                    query: { search: tag }
                }}>
                    <a>{tag}</a>
                </Link >

            )

        })

    );

}

export default LabelComponent;