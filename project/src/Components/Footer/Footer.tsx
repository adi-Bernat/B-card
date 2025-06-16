import {
    Footer,
    FooterBrand,
    FooterCopyright,
    FooterDivider,
    FooterIcon,
    FooterLink,
    FooterLinkGroup,
    FooterTitle,
} from "flowbite-react";
import { JSX } from "react";
import { BsEnvelope, BsFacebook, BsGeoAlt, BsGithub, BsInstagram, BsTelephone } from "react-icons/bs";

const FooterComponent = (): JSX.Element => {
    return (
        <Footer container>
            <div className="w-full">
                <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
                    <div>
                        <FooterBrand
                            href="/"
                            src="/img/bc-card-svgrepo-com.svg"
                            alt="BC Card Logo"
                            name="BC Card"
                        />

                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6 ">
                        <div>
                            <FooterTitle title="Quick links" />
                            <FooterLinkGroup col>
                                <FooterLink href="/*">Home</FooterLink>
                                <FooterLink href="#">About</FooterLink>
                            </FooterLinkGroup>
                        </div>
                        <div>
                            <FooterTitle title="Follow us" />
                            <div className="mt-4 sm:mt-0 flex space-x-6 sm:justify-center">
                                <FooterIcon href="#" icon={BsFacebook} />
                                <FooterIcon href="https://www.instagram.com/" icon={BsInstagram} />
                                <FooterIcon href="https://github.com/" icon={BsGithub} />
                            </div>
                        </div>
                        <div>
                            <FooterTitle title="Legal" />
                            <FooterLinkGroup col>
                                <FooterLink href="#">Privacy Policy</FooterLink>
                                <FooterLink href="#">Terms &amp; Conditions</FooterLink>
                            </FooterLinkGroup>
                        </div>
                    </div>
                </div>
                <FooterDivider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <FooterCopyright href="#" by="BCard" year={2025} />

                    <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center sm:space-x-8">
                        <div>
                            <FooterTitle title="Contact info" />
                            <ul className="mt-2 space-y-2 text-gray-500 dark:text-gray-400 text-sm">
                                <li className="flex items-center gap-2">
                                    <BsTelephone /> <span>052-8592335</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <BsEnvelope /> <span>dybrnt28@gmail.com</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <BsGeoAlt /> <span>תל אביב, ישראל</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Footer>
    );
};

export default FooterComponent;
