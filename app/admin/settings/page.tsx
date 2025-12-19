'use client'

import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/lib/hooks/use-admin-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'

export default function AdminSettingsPage() {
  const { admin } = useAdminAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [declarationPrice, setDeclarationPrice] = useState('149.90')
  
  const [maxAssets, setMaxAssets] = useState('5')
  const [maxTotalAssetValue, setMaxTotalAssetValue] = useState('500000')
  const [maxDebts, setMaxDebts] = useState('3')
  const [maxTotalDebtValue, setMaxTotalDebtValue] = useState('100000')
  const [maxIncomes, setMaxIncomes] = useState('3')
  const [maxTotalIncomeValue, setMaxTotalIncomeValue] = useState('200000')
  const [maxDependents, setMaxDependents] = useState('2')
  const [maxDeductibleExpenses, setMaxDeductibleExpenses] = useState('10')
  const [maxTotalDeductibleValue, setMaxTotalDeductibleValue] = useState('50000')
  
  const [maxRealEstateProperties, setMaxRealEstateProperties] = useState('2')
  const [maxVehicles, setMaxVehicles] = useState('2')
  const [maxBankAccounts, setMaxBankAccounts] = useState('3')
  
  const [maxCapitalGains, setMaxCapitalGains] = useState('5')
  const [maxStockOperations, setMaxStockOperations] = useState('10')
  const [maxCryptoOperations, setMaxCryptoOperations] = useState('5')
  const [hasRuralActivity, setHasRuralActivity] = useState(false)
  const [hasForeignIncome, setHasForeignIncome] = useState(false)
  const [hasFIIOperations, setHasFIIOperations] = useState(false)
  
  const [allowForeignAssets, setAllowForeignAssets] = useState(false)
  const [allowRuralActivity, setAllowRuralActivity] = useState(false)
  const [allowComplexInvestments, setAllowComplexInvestments] = useState(false)
  const [allowDomesticEmployees, setAllowDomesticEmployees] = useState(true)
  
  const [reviewIfSpouseWithIncome, setReviewIfSpouseWithIncome] = useState(true)
  const [reviewIfMultipleSources, setReviewIfMultipleSources] = useState(true)
  const [reviewIfHighValue, setReviewIfHighValue] = useState(true)
  const [highValueThreshold, setHighValueThreshold] = useState('1000000')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      
      if (data.declaration_price) {
        setDeclarationPrice(data.declaration_price.amount.toString())
      }
      
      if (data.client_profile_rules) {
        const rules = data.client_profile_rules.autonomous_threshold
        setMaxAssets(rules.max_assets?.toString() || '5')
        setMaxTotalAssetValue(rules.max_total_asset_value?.toString() || '500000')
        setMaxDebts(rules.max_debts?.toString() || '3')
        setMaxTotalDebtValue(rules.max_total_debt_value?.toString() || '100000')
        setMaxIncomes(rules.max_incomes?.toString() || '3')
        setMaxTotalIncomeValue(rules.max_total_income_value?.toString() || '200000')
        setMaxDependents(rules.max_dependents?.toString() || '2')
        setMaxDeductibleExpenses(rules.max_deductible_expenses?.toString() || '10')
        setMaxTotalDeductibleValue(rules.max_total_deductible_value?.toString() || '50000')
        setMaxRealEstateProperties(rules.max_real_estate_properties?.toString() || '2')
        setMaxVehicles(rules.max_vehicles?.toString() || '2')
        setMaxBankAccounts(rules.max_bank_accounts?.toString() || '3')
        setMaxCapitalGains(rules.max_capital_gains?.toString() || '5')
        setMaxStockOperations(rules.max_stock_operations?.toString() || '10')
        setMaxCryptoOperations(rules.max_crypto_operations?.toString() || '5')
        setAllowForeignAssets(rules.allow_foreign_assets || false)
        setAllowRuralActivity(rules.allow_rural_activity || false)
        setAllowComplexInvestments(rules.allow_complex_investments || false)
        setAllowDomesticEmployees(rules.allow_domestic_employees ?? true)
        setReviewIfSpouseWithIncome(rules.review_if_spouse_with_income ?? true)
        setReviewIfMultipleSources(rules.review_if_multiple_sources ?? true)
        setReviewIfHighValue(rules.review_if_high_value ?? true)
        setHighValueThreshold(rules.high_value_threshold?.toString() || '1000000')
      }
    } catch (error) {
      console.error('[v0] Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)
    
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          declaration_price: {
            amount: parseFloat(declarationPrice),
            currency: 'BRL'
          },
          client_profile_rules: {
            autonomous_threshold: {
              max_assets: parseInt(maxAssets),
              max_total_asset_value: parseFloat(maxTotalAssetValue),
              max_debts: parseInt(maxDebts),
              max_total_debt_value: parseFloat(maxTotalDebtValue),
              max_incomes: parseInt(maxIncomes),
              max_total_income_value: parseFloat(maxTotalIncomeValue),
              max_dependents: parseInt(maxDependents),
              max_deductible_expenses: parseInt(maxDeductibleExpenses),
              max_total_deductible_value: parseFloat(maxTotalDeductibleValue),
              max_real_estate_properties: parseInt(maxRealEstateProperties),
              max_vehicles: parseInt(maxVehicles),
              max_bank_accounts: parseInt(maxBankAccounts),
              max_capital_gains: parseInt(maxCapitalGains),
              max_stock_operations: parseInt(maxStockOperations),
              max_crypto_operations: parseInt(maxCryptoOperations),
              allow_foreign_assets: allowForeignAssets,
              allow_rural_activity: allowRuralActivity,
              allow_complex_investments: allowComplexInvestments,
              allow_domestic_employees: allowDomesticEmployees,
              review_if_spouse_with_income: reviewIfSpouseWithIncome,
              review_if_multiple_sources: reviewIfMultipleSources,
              review_if_high_value: reviewIfHighValue,
              high_value_threshold: parseFloat(highValueThreshold)
            },
            inconsistency_threshold: {
              description: 'Qualquer cliente que ultrapassar os limites acima será marcado para revisão manual'
            }
          }
        })
      })
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('[v0] Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie parâmetros detalhados e regras de classificação de clientes
        </p>
      </div>

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Configurações salvas com sucesso!
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Precificação</CardTitle>
            <CardDescription>
              Defina o valor cobrado por declaração
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="price">Preço da Declaração (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={declarationPrice}
                  onChange={(e) => setDeclarationPrice(e.target.value)}
                  className="max-w-xs"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Valor que será cobrado do cliente ao adquirir uma declaração
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regras de Classificação de Clientes</CardTitle>
            <CardDescription>
              Configure filtros detalhados para determinar quais clientes podem prosseguir autonomamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="patrimonio" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="patrimonio">Patrimônio</TabsTrigger>
                <TabsTrigger value="rendimentos">Rendimentos</TabsTrigger>
                <TabsTrigger value="deducoes">Deduções</TabsTrigger>
                <TabsTrigger value="complexidade">Complexidade</TabsTrigger>
              </TabsList>

              <TabsContent value="patrimonio" className="space-y-6 mt-6">
                <div>
                  <h3 className="font-semibold mb-3">Limites de Bens e Ativos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxAssets">Máximo de Bens Totais</Label>
                      <Input
                        id="maxAssets"
                        type="number"
                        value={maxAssets}
                        onChange={(e) => setMaxAssets(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Quantidade total de bens cadastrados
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="maxTotalAssetValue">Valor Total de Bens (R$)</Label>
                      <Input
                        id="maxTotalAssetValue"
                        type="number"
                        value={maxTotalAssetValue}
                        onChange={(e) => setMaxTotalAssetValue(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Soma de todos os valores de bens
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="maxRealEstate">Máximo de Imóveis</Label>
                      <Input
                        id="maxRealEstate"
                        type="number"
                        value={maxRealEstateProperties}
                        onChange={(e) => setMaxRealEstateProperties(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Imóveis, casas, apartamentos, terrenos
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="maxVehicles">Máximo de Veículos</Label>
                      <Input
                        id="maxVehicles"
                        type="number"
                        value={maxVehicles}
                        onChange={(e) => setMaxVehicles(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Carros, motos, embarcações
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="maxBankAccounts">Máximo de Contas Bancárias</Label>
                      <Input
                        id="maxBankAccounts"
                        type="number"
                        value={maxBankAccounts}
                        onChange={(e) => setMaxBankAccounts(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Contas correntes, poupança, investimentos
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Limites de Dívidas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxDebts">Máximo de Dívidas</Label>
                      <Input
                        id="maxDebts"
                        type="number"
                        value={maxDebts}
                        onChange={(e) => setMaxDebts(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Quantidade de dívidas cadastradas
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="maxTotalDebtValue">Valor Total de Dívidas (R$)</Label>
                      <Input
                        id="maxTotalDebtValue"
                        type="number"
                        value={maxTotalDebtValue}
                        onChange={(e) => setMaxTotalDebtValue(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Soma de todas as dívidas
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rendimentos" className="space-y-6 mt-6">
                <div>
                  <h3 className="font-semibold mb-3">Limites de Rendimentos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxIncomes">Máximo de Fontes de Renda</Label>
                      <Input
                        id="maxIncomes"
                        type="number"
                        value={maxIncomes}
                        onChange={(e) => setMaxIncomes(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Número de fontes pagadoras diferentes
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="maxTotalIncomeValue">Renda Total Anual (R$)</Label>
                      <Input
                        id="maxTotalIncomeValue"
                        type="number"
                        value={maxTotalIncomeValue}
                        onChange={(e) => setMaxTotalIncomeValue(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Soma de todos os rendimentos do ano
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Operações Financeiras</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxCapitalGains">Máximo de Ganhos de Capital</Label>
                      <Input
                        id="maxCapitalGains"
                        type="number"
                        value={maxCapitalGains}
                        onChange={(e) => setMaxCapitalGains(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Vendas de bens com lucro
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="maxStockOperations">Máximo de Operações em Bolsa</Label>
                      <Input
                        id="maxStockOperations"
                        type="number"
                        value={maxStockOperations}
                        onChange={(e) => setMaxStockOperations(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Número de operações mensais em ações
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="maxCryptoOperations">Máximo de Operações Cripto</Label>
                      <Input
                        id="maxCryptoOperations"
                        type="number"
                        value={maxCryptoOperations}
                        onChange={(e) => setMaxCryptoOperations(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Operações com criptomoedas
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="deducoes" className="space-y-6 mt-6">
                <div>
                  <h3 className="font-semibold mb-3">Despesas Dedutíveis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxDeductibleExpenses">Máximo de Despesas Cadastradas</Label>
                      <Input
                        id="maxDeductibleExpenses"
                        type="number"
                        value={maxDeductibleExpenses}
                        onChange={(e) => setMaxDeductibleExpenses(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Número de despesas dedutíveis
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="maxTotalDeductibleValue">Valor Total de Deduções (R$)</Label>
                      <Input
                        id="maxTotalDeductibleValue"
                        type="number"
                        value={maxTotalDeductibleValue}
                        onChange={(e) => setMaxTotalDeductibleValue(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Soma de todas as despesas dedutíveis
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="maxDependents">Máximo de Dependentes</Label>
                      <Input
                        id="maxDependents"
                        type="number"
                        value={maxDependents}
                        onChange={(e) => setMaxDependents(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Número de dependentes cadastrados
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="complexidade" className="space-y-6 mt-6">
                <div>
                  <h3 className="font-semibold mb-3">Permissões de Perfil Autônomo</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Defina quais tipos de declarações podem ser processadas automaticamente
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allowForeignAssets">Permitir Bens no Exterior</Label>
                        <p className="text-xs text-muted-foreground">
                          Cliente pode ter bens e direitos fora do Brasil
                        </p>
                      </div>
                      <Switch
                        id="allowForeignAssets"
                        checked={allowForeignAssets}
                        onCheckedChange={setAllowForeignAssets}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allowRuralActivity">Permitir Atividade Rural</Label>
                        <p className="text-xs text-muted-foreground">
                          Cliente pode declarar atividade rural
                        </p>
                      </div>
                      <Switch
                        id="allowRuralActivity"
                        checked={allowRuralActivity}
                        onCheckedChange={setAllowRuralActivity}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allowComplexInvestments">Permitir Investimentos Complexos</Label>
                        <p className="text-xs text-muted-foreground">
                          FII, day-trade, opções, derivativos
                        </p>
                      </div>
                      <Switch
                        id="allowComplexInvestments"
                        checked={allowComplexInvestments}
                        onCheckedChange={setAllowComplexInvestments}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allowDomesticEmployees">Permitir Empregados Domésticos</Label>
                        <p className="text-xs text-muted-foreground">
                          Cliente pode ter empregados domésticos
                        </p>
                      </div>
                      <Switch
                        id="allowDomesticEmployees"
                        checked={allowDomesticEmployees}
                        onCheckedChange={setAllowDomesticEmployees}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Gatilhos de Revisão Automática</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Situações que forçam revisão manual mesmo dentro dos limites
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reviewIfSpouse">Revisar se Cônjuge com Renda</Label>
                        <p className="text-xs text-muted-foreground">
                          Declarações com cônjuge que possui renda própria
                        </p>
                      </div>
                      <Switch
                        id="reviewIfSpouse"
                        checked={reviewIfSpouseWithIncome}
                        onCheckedChange={setReviewIfSpouseWithIncome}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reviewIfMultiple">Revisar se Múltiplas Fontes</Label>
                        <p className="text-xs text-muted-foreground">
                          Cliente com mais de 3 fontes pagadoras diferentes
                        </p>
                      </div>
                      <Switch
                        id="reviewIfMultiple"
                        checked={reviewIfMultipleSources}
                        onCheckedChange={setReviewIfMultipleSources}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reviewIfHigh">Revisar se Alto Valor</Label>
                        <p className="text-xs text-muted-foreground">
                          Patrimônio acima do valor configurado abaixo
                        </p>
                      </div>
                      <Switch
                        id="reviewIfHigh"
                        checked={reviewIfHighValue}
                        onCheckedChange={setReviewIfHighValue}
                      />
                    </div>
                    
                    {reviewIfHighValue && (
                      <div className="ml-6">
                        <Label htmlFor="highValueThreshold">Limite de Alto Valor (R$)</Label>
                        <Input
                          id="highValueThreshold"
                          type="number"
                          value={highValueThreshold}
                          onChange={(e) => setHighValueThreshold(e.target.value)}
                          className="max-w-xs"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Patrimônio total que aciona revisão manual
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />

            <Alert>
              <AlertDescription>
                <strong>Como funciona:</strong> Clientes que atenderem TODOS os critérios configurados poderão prosseguir de forma autônoma. 
                Qualquer violação de limites ou ativação de gatilhos criará automaticamente uma inconsistência para revisão manual pela equipe.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? 'Salvando...' : 'Salvar Todas as Configurações'}
          </Button>
        </div>
      </div>
    </div>
  )
}
