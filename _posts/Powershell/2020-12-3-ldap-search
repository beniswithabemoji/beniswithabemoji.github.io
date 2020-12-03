---
title: LDAP Searcher
author: Benis
date: 2020-12-3 10:36:00
categories: [Powershell, Scripts]
tags: [LDAP, Search]
---

LDAP Searcher:

```powershell
function LDAP-Search {
    $user = #samaccountname     'benis'
    $OU = #OU   "OU=computers,DC=contoso,DC=com"
	$Searcher = New-Object DirectoryServices.DirectorySearcher
	$Searcher.SearchRoot = 'LDAP://$OU'
	$Searcher.Filter = "(&(objectClass=user)(objectCategory=person)(sAMAccountName=$user))"
	$res = $Searcher.FindAll()  | Sort-Object path
	foreach ($usrTmp in $res) {
  
		Write-Host $usrTmp.Properties["cn"]
	}
	Write-Host "------------------------------"
	Write-Host "Number of Users Returned: " @($res).count
	Write-Host
}

```