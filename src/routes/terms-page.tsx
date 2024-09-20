import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const illustrations = [
	{
		src: 'https://doodleipsum.com/700/abstract?i=3c3a259ced051ff05ebf18363560f8a3',
		alt: 'Color Comp by Pablo Stanley',
		author: {
			name: 'Pablo Stanley',
			link: 'https://blush.design/artists/RyUTVuP8G4QeAAEEQgug/pablo-stanley',
		},
	},
	{
		src: 'https://doodleipsum.com/700/hand-drawn?i=549fd6b2ac4a1320244488c557a12015',
		alt: 'Super Idea by Irene Falgueras',
		author: {
			name: 'Irene Falgueras',
			link: 'https://blush.design/artists/iDxEJwP2Ha4IrbT6bF88/irene-falgueras',
		},
	},
	{
		src: 'https://doodleipsum.com/700/hand-drawn?i=6738e9c2e5392902be20c7d69e752c52',
		alt: 'Managing by Irene Falgueras',
		author: {
			name: 'Irene Falgueras',
			link: 'https://blush.design/artists/iDxEJwP2Ha4IrbT6bF88/irene-falgueras',
		},
	},
	{
		src: 'https://doodleipsum.com/700/outline?i=5458626fd5e09b7a5e2d93029245636c',
		alt: 'Media by Karthik Srinivas',
		author: {
			name: 'Karthik Srinivas',
			link: 'https://blush.design/artists/2R6I2GWLU5B6Czx7Jma4/karthik-srinivas',
		},
	},
	{
		src: 'https://doodleipsum.com/700/outline?i=55aa69c1a283b92cf3c87e6a3a598eaf',
		alt: 'Fast Delivery by Ivan Meonosaroš',
		author: {
			name: 'Ivan Mesaroš',
			link: 'https://blush.design/artists/ICyBIwuhfmhgrHL2IlWr/ivan-mesaros',
		},
	},
];

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Page } from '../components/ui/page';

export function TermsPage() {
	return (
		<Page component="article">
			<Typography variant="h3" component="h1" gutterBottom>
				Mentions légales
			</Typography>
			<Typography gutterBottom>
				Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour
				la confiance en l'économie numérique, il est précisé aux utilisateurs du
				Site l'identité des différents intervenants dans le cadre de sa
				réalisation et de son suivi.
			</Typography>
			<Typography variant="h5" component="h2" sx={{ mt: 4, mb: 1 }}>
				Éditeur du site Web
			</Typography>
			<Typography>Chen Xing</Typography>
			<Typography gutterBottom>xing.chen1@protonmail.com</Typography>
			<Typography variant="h5" component="h2" sx={{ mt: 4, mb: 1 }}>
				Hébergement
			</Typography>
			<Typography gutterBottom>
				museifier.xingchen.fr est hébergé par OVH SAS 2 rue Kellermann - 59100
				Roubaix - France.
			</Typography>
			<Typography gutterBottom>
				Site Web :{' '}
				<Link href="https://www.ovhcloud.com/fr/">
					https://www.ovhcloud.com/fr/
				</Link>
			</Typography>
			<Typography variant="h5" component="h2" sx={{ mt: 4, mb: 1 }}>
				Protection des données personnelles
			</Typography>
			<Typography gutterBottom>
				Le site Web museifier.xingchen.fr ne collecte aucune donnée personnelle.
				Il est possible de se connecter avec les identifiants fournis par
				l'auteur du site. J'accorde une grande importance à la protection de
				votre vie privée, et cette approche vise à minimiser toute collecte de
				données personnelles. Si vous avez des questions ou des préoccupations
				concernant la confidentialité, n'hésitez pas à me contacter.
			</Typography>
			<Typography variant="h5" component="h2" sx={{ mt: 4, mb: 1 }}>
				Objectif du site
			</Typography>
			<Typography gutterBottom>
				Le site web museifier.xingchen.fr a été créé pour démontrer mes
				compétences en développement full stack. Il permet aux utilisateurs de
				découvrir et de gérer leurs visites de musées en France en utilisant des
				données réelles provenant de{' '}
				<Link href="https://www.data.gouv.fr/fr/datasets/liste-et-localisation-des-musees-de-france/">
					data.gouv.fr
				</Link>
				. L'objectif principal de ce site est de fournir une expérience
				utilisateur fluide et informative, en mettant à disposition des
				informations vérifiées sur les musées français. Aucune offre de service
				n'est réellement proposée, et tout contenu est uniquement destiné à
				illustrer mes capacités techniques. Si vous avez des questions ou
				souhaitez en savoir plus sur le projet, n'hésitez pas à me contacter.
			</Typography>
			<Typography variant="h5" component="h2" sx={{ mt: 4, mb: 1 }}>
				Crédits
			</Typography>
			<ImageList sx={{ width: '65%' }}>
				{illustrations.map((item) => (
					<ImageListItem key={item.src}>
						<img
							src={`${item.src}`}
							alt={item.alt}
							loading="lazy"
							style={{ objectFit: 'contain' }}
						/>

						<ImageListItemBar
							title={
								<Link
									href={item.author.link}
									color="primary"
									sx={{ textDecoration: 'none' }}
								>
									{item.author.name}
								</Link>
							}
							position="below"
						/>
					</ImageListItem>
				))}
			</ImageList>
		</Page>
	);
}
