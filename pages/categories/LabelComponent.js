import Link from 'next/link'


const LabelComponent = ({tags}) => {

    return (

        tags.map(tag => {

            return (

                // clicking on a category is the same as searching for that word
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