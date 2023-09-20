import Link from "next/link";

const NavbarTagsComponent = ({ tags }) => {

    if (tags) {
        return (
            tags.map(tag => {
                return (
                    <Link href={{
                        pathname: '/browse',
                        query: {
                            search: tag.substring(1),
                            tags: tags
                        }
                    }}
                    >
                        <a>{tag}</a>
                    </Link>
                )
            })
        )
    }
}

export default NavbarTagsComponent;