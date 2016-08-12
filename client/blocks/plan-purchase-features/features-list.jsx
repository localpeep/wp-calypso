/**
 * External dependencies
 */
import React from 'react';
import { localize } from 'i18n-calypso';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import PurchaseDetail from 'components/purchase-detail';
import GoogleVoucherDetails from 'my-sites/upgrades/checkout-thank-you/google-voucher';
import QuerySiteVouchers from 'components/data/query-site-vouchers';
import HappinessSupport from 'components/happiness-support';
import PlanIcon from 'components/plans/plan-icon';

export const FindNewThemeFeature = localize( ( { selectedSite, translate } ) => {
	return (
		<div className="plan-purchase-features__item">
			<PurchaseDetail
				icon="customize"
				title={ translate( 'Find a new theme' ) }
				description={ translate( 'All our premium themes are now available at no extra cost. Try them out now.' ) }
				buttonText={ translate( 'Browse premium themes' ) }
				href={ '/design/' + selectedSite.slug }
			/>
		</div>
	);
} );

export const AdvertisingRemovedFeature = localize( ( { isBusinessPlan, translate } ) => {
	return (
		<div className="plan-purchase-features__item">
			<PurchaseDetail
				icon="speaker"
				title={ translate( 'Advertising Removed' ) }
				description={ isBusinessPlan
					? translate( 'With your plan, all WordPress.com advertising has been removed from your site.' )
					: translate( 'With your plan, all WordPress.com advertising has been removed from your site.' +
						' You can upgrade to a Business plan to also remove the WordPress.com footer credit.' )
				}
			/>
		</div>
	);
} );

export const CustomizeThemeFeature = localize( ( { customizeLink, isCustomizeEnabled, translate } ) => {
	return (
		<div className="plan-purchase-features__item">
			<PurchaseDetail
				icon="customize"
				title={ translate( 'Customize your theme' ) }
				description={
					translate(
						"You now have direct control over your site's fonts and colors in the customizer. " +
						"Change your site's entire look in a few clicks."
					)
				}
				buttonText={ translate( 'Start customizing' ) }
				href={ customizeLink }
				target={ isCustomizeEnabled ? undefined : '_blank' }
			/>
		</div>
	);
} );

export const VideoAudioPostsFeature = localize( ( { paths, selectedSite, translate } ) => {
	return (
		<div className="plan-purchase-features__item">
			<PurchaseDetail
				icon="image-multiple"
				title={ translate( 'Video and audio posts' ) }
				description={
					translate(
						'Enrich your posts with video and audio, uploaded directly on your site. ' +
						'No ads or limits. The Premium plan also adds 10GB of file storage.'
					)
				}
				buttonText={ translate( 'Start a new post' ) }
				href={ paths.newPost( selectedSite ) }
			/>
		</div>
	);
} );

export const MonetizeSiteFeature = localize( ( { selectedSite, translate } ) => {
	return (
		<div className="plan-purchase-features__item">
			<PurchaseDetail
				icon="speaker"
				title={ translate( 'Easily monetize your site' ) }
				description={
					translate(
						'Take advantage of WordAds instant activation on your upgraded site. ' +
						'WordAds lets you earn money by displaying promotional content.'
					)
				}
				buttonText={ translate( 'Start Earning' ) }
				href={ '/ads/settings/' + selectedSite.slug }
			/>
		</div>
	);
} );

export const GoogleAnalyticsStatsFeature = localize( ( { selectedSite, translate } ) => {
	return (
		<div className="plan-purchase-features__item">
			<PurchaseDetail
				icon="stats-alt"
				title={ translate( 'Stats from Google Analytics' ) }
				description={ translate( 'Connect to Google Analytics for the perfect complement to WordPress.com stats.' ) }
				buttonText={ translate( 'Connect Google Analytics' ) }
				href={ '/settings/analytics/' + selectedSite.slug }
			/>
		</div>
	);
} );

export const CustomDomainFeature = localize( ( { selectedSite, translate } ) => {
	return (
		<div className="plan-purchase-features__item">
			<PurchaseDetail
				icon="globe"
				title={ translate( 'Get your custom domain' ) }
				description={
					translate(
						"Replace your site's address, {{em}}%(siteDomain)s{{/em}}, with a custom domain. " +
						'A free domain is included with your plan.',
						{
							args: { siteDomain: selectedSite.slug },
							components: { em: <em /> }
						}
					)
				}
				buttonText={ translate( 'Claim your free domain' ) }
				href={ '/domains/add/' + selectedSite.slug }
			/>
		</div>
	);
} );

export const GoogleVouchersFeature = ( { selectedSite } ) => {
	return (
		<div className="plan-purchase-features__item">
			<QuerySiteVouchers siteId={ selectedSite.ID } />
			<GoogleVoucherDetails selectedSite={ selectedSite } />
		</div>
	);
};

export const JetpackFeatures = localize( ( {
	selectedSite,
	user,
	analytics,
	utils,
	isPluginsSetupEnabled,
	translate
} ) => {
	const props = {
		icon: 'cog',
		title: translate( 'Set up your VaultPress and Akismet accounts' ),
		description: translate(
			'We emailed you at %(email)s with information for setting up Akismet and VaultPress on your site. ' +
			'Follow the instructions in the email to get started.',
			{ args: { email: user.get().email } }
		)
	};

	if ( isPluginsSetupEnabled ) {
		const trackManualInstall = ( eventName ) => {
			return () => {
				analytics.tracks.recordEvent( eventName );
			};
		};

		const reasons = utils.getSiteFileModDisableReason( selectedSite, 'modifyFiles' );
		if ( reasons && reasons.length > 0 ) {
			analytics.tracks.recordEvent( 'calypso_plans_autoconfig_halt_filemod', { error: reasons[ 0 ] } );
		} else if ( ! selectedSite.hasMinimumJetpackVersion ) {
			analytics.tracks.recordEvent(
				'calypso_plans_autoconfig_halt_jpversion',
				{ jetpack_version: selectedSite.options.jetpack_version }
			);
		} else if ( selectedSite.is_multisite && ! selectedSite.isMainNetworkSite() ) {
			analytics.tracks.recordEvent( 'calypso_plans_autoconfig_halt_multisite' );
		} else if ( selectedSite.options.is_multi_network ) {
			analytics.tracks.recordEvent( 'calypso_plans_autoconfig_halt_multinetwork' );
		}

		props.title = null;
		if ( ! selectedSite.canUpdateFiles ) {
			props.description = translate(
				'You can now install Akismet and VaultPress, which will automatically protect your site from spam and data loss. ' +
				'If you have any questions along the way, we\'re here to help!'
			);
			props.buttonText = translate( 'Installation Instructions' );
			props.href = 'https://en.support.wordpress.com/setting-up-premium-services/';
			props.onClick = trackManualInstall( 'calypso_plans_autoconfig_click_manual_install' );
		} else {
			props.description = translate(
				'We are about to install Akismet and VaultPress for your site, which will automatically protect your site from spam ' +
				'and data loss. If you have any questions along the way, we\'re here to help! You can also perform a manual ' +
				'installation by following {{a}}these instructions{{/a}}.',
				{ components: {
					a: <a
						target="_blank"
						href="https://en.support.wordpress.com/setting-up-premium-services/"
						onClick={ trackManualInstall( 'calypso_plans_autoconfig_click_opt_out' ) } />
				} }
			);
			props.buttonText = translate( 'Set up your plan' );
			props.href = `/plugins/setup/${selectedSite.slug}`;
		}
	}

	return (
		<div className="plan-purchase-features__item">
			<PurchaseDetail { ...props }/>
		</div>
	);
} );

export const HapinessSupportFeature = ( { selectedSite } ) => {
	return (
		<div className="plan-purchase-features__item">
			<div className="plan-purchase-features__item-content">
				<HappinessSupport
					isJetpack={ !! selectedSite.jetpack }
					isPlaceholder={ false }
				/>
			</div>
		</div>
	);
};

export const CurrentPlanHeaderFeature = ( {
	selectedSite,
	hasLoadedFromServer,
	title,
	tagLine
} ) => {
	const currentPlan = selectedSite.plan.product_slug;

	return (
		<div className="plan-purchase-features__item">
			<div className="plan-purchase-features__item-content">
				<div className="plan-purchase-features__header-icon">
					{
						currentPlan &&
							<PlanIcon plan={ currentPlan } />
					}
				</div>
				<div className="plan-purchase-features__header-copy">
					<h1 className={
						classNames( {
							'plan-purchase-features__header-heading': true,
							'is-placeholder': ! hasLoadedFromServer
						} )
					} >
						{ title }
					</h1>

					<h2 className={
						classNames( {
							'plan-purchase-features__header-text': true,
							'is-placeholder': ! hasLoadedFromServer
						} )
					} >
						{ tagLine }
					</h2>
				</div>
			</div>
		</div>
	);
};
