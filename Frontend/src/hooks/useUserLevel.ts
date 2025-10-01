/* funções especiais do React que permitem usar state, efeitos colaterais e outros recursos do React em componentes funcionais.

Exemplos mais comuns:
useState → cria e gerencia estado local.
useEffect → executa efeitos colaterais (API calls, timers, assinaturas).
useRef → mantém referências persistentes.
useMemo / useCallback → otimização de renderização. */

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { getUserLevel } from "../services/userService";

export const useUserLevel = () => {
  const { token } = useContext(AuthContext);
  const [level, setLevel] = useState<number>(0);
  const [xp, setXp] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLevel = async () => {
      if (!token) return;

      try {
        const res = await getUserLevel(token);
        setLevel(res.level);
        setXp(res.xp);
      } catch (err: any) {
        console.log("Erro ao buscar level:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLevel();
  }, [token]);

  return { level, xp, loading };
};
