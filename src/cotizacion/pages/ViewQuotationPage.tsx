// import { ReferenceSection } from "../components/ReferenceSection";
// // import { TestAndPricesSection } from "../ui/components/TestAndPricesSection";
// // import { ConditionSection } from "../ui/components/ConditionSection";
// // import { PreviewSection } from "../ui/components/PreviewSection";
// import { ScrollArea } from "@/shared/components/ui/scroll-area";
// // import { ControlPanel } from "../ui/components/ControlPanel";
// // import { QuotationProviderV2 } from "../context/ViewQuotationProvider";

// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/shared/components/ui/tabs";
// import { useSearchParams } from "react-router";

// export function ViewQuotationPage () {
//   const [searchParams] = useSearchParams();
//   const orderId = searchParams.get("orderId");
//   if (!orderId) {
//     throw new Error("Id de la solicitud no especificada");
//   }
//   return (
//     // <QuotationProviderV2>
//     <Tabs defaultValue="reference">
//       <TabsList>
//         <TabsTrigger value="reference">Datos de Referencia</TabsTrigger>
//         <TabsTrigger value="prices">Precios</TabsTrigger>
//         <TabsTrigger value="conditions">Condiciones</TabsTrigger>
//         <TabsTrigger value="visualize">Visualización</TabsTrigger>
//       </TabsList>
//       <ScrollArea>
//         <TabsContent value="reference">
//           <ReferenceSection orderId={Number(orderId)} />
//         </TabsContent>
//         {/* <TabsContent value="prices">
//             <TestAndPricesSection />
//           </TabsContent>
//           <TabsContent value="conditions">
//             <ConditionSection />
//           </TabsContent>
//           <TabsContent value="visualize">
//             <PreviewSection />
//           </TabsContent> */}
//       </ScrollArea>
//     </Tabs>
//     // </QuotationProviderV2>
//   );
// };
// export default ViewQuotationPage;
