import Link from 'next/link'


const LabelComponent = ({tags}) => {

    if(tags){

        return tags.map(tag => {

            return (
                // clicking on a category is the same as searching for that word
                <Link
                    key={tag}
                    href={{
                        pathname: '/browse',
                        query: { search: tag }
                    }}
                    legacyBehavior>
                    <p>{tag}</p>
                </Link >
            );

        });
        
    }

}

export default LabelComponent;