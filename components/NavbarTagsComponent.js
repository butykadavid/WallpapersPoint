import Link from "next/link";

import { v4 as uuidv4 } from 'uuid'

const NavbarTagsComponent = ({ tags }) => {

    if (tags) {
        return tags.map(tag => {
            return (
                <Link key={uuidv4()}
                    href={{
                        pathname: '/browse',
                        query: {
                            search: tag.substring(1),
                            tags: tags
                        }
                    }}
                >
                    {tag}
                </Link>
            );
        });
    }
}

export default NavbarTagsComponent;