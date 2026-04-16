import { Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import CompanyLogo from "./images/engineer-fire-logo.jpg";
import SGSLogo from "./images/sgs-logo.jpg"
import HodelpeLogo from "./images/hodelpe-logo.jpg";
// import NFPAMemberLogo from "./images/NFPA-Member-Logo.jpg"
const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingBottom: 10,
  },
  logoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  companyLogo: {
    width: 120,
    height: 120,
  },
  sgsLogo: {
    width: 100,
    height: 98,
  },
  hodelpeLogo: {
    width: 100,
    height: 60,
  },
  NFPAlogo: {
    width: 158,
    height: 226,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 4,
  },
});

const Header = () => (
  <View style={styles.header}>
    {/* Logos: coloca tus imágenes en /assets/images */}
    <View style={styles.logoRow}>
      <Image src={CompanyLogo} style={styles.companyLogo} />
      <Image src={SGSLogo} style={styles.sgsLogo}/>
      <Image src={HodelpeLogo} style={styles.hodelpeLogo} />
      {/* <Image src={NFPAMemberLogo} style={styles.NFPAlogo} /> */}
    </View>

    <Text style={styles.title}>Cotización Propuesta</Text>
    <Text style={styles.subtitle}>
      Reciba nuestros cordiales saludos. A continuación, presentamos la propuesta técnica-económica solicitada.
    </Text>
  </View>
);

export default Header;
