
export const useInitializeConditionsFromRequest =
  (requestData) => {

  const setAll = useConditionStore(
    (s) => s.setAll
  );

  useEffect(() => {
    if (!requestData) return;

    setAll({
      emissionDate: requestData.date,
      expirationDate:
        requestData.expiration,
    });

  }, [requestData]);
};