import Link from 'next/link'


const LabelComponent = ({tags}) => {

    return (

        tags.map(tag => {

            return (

                // clicking on a category is the same as searching for that word
                <Link key={tag} href={{
                    pathname: '/browse',
                    query: { search: tag }
                }}>
                    <p>{tag}</p>
                </Link >

            )

        })

    );

}

export default LabelComponent;