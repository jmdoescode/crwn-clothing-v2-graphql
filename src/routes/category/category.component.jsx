import { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";

import ProductCard from "../../components/product-card/product-card.component";
import Spinner from "../../components/spinner/spinner.component";

import { CategoryContainer, Title } from "./category.styles";

//Replace the categories context that was used before with graphql
//NOTE: APOLLO CACHES THE QUERIES, NOT THE RESULTS
const GET_CATEGORY = gql`
	query ($title: String!) {
		getCollectionsByTitle(title: $title) {
			id
			title
			items {
				id
				price
				imageUrl
			}
		}
	}
`;

//addCategory() //this muatation name would come from graphql
const SET_CATEGORY = gql`
	mutation ($category: Category!) {
		addCategory(category: $category) {
			id
			title
			items {
				id
				price
				imageUrl
			}
		}
	}
`;

const Category = () => {
	const { category } = useParams();

	// const { loading, error, data } = useQuery(GET_CATEGORY, {
	// 	variables: {
	// 		title: category,
	// 	},
	// });

	console.log("data", data);

	//This is a mutating function where you get the addCategory back from useMutation(SET_CATEGORY)
	const [addCategory, { loading, error, data }] = useMutation(SET_CATEGORY); 

	//this is the mutation from above
	addCategory({ variables: { category: categoryObject } }); 

	//Notice that if you go back to hats route for example, and reload, it won't make another call to graphql
	//You can see this in the networks tab (example in oneNote)
	useEffect(() => {
		if (data) {
			const {
				getCollectionsByTitle: { items },
			} = data;

			setProducts(items);
		}
	}, [category, data]);

	const [products, setProducts] = useState([]);

	return (
		<Fragment>
			{loading ? (
				<Spinner />
			) : (
				<Fragment>
					<Title>{category.toUpperCase()}</Title>
					<CategoryContainer>
						{products &&
							products.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
					</CategoryContainer>
				</Fragment>
			)}
		</Fragment>
	);
};

export default Category;
